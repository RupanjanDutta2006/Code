import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const CONNECTIONS_FILE = path.join(DATA_DIR, 'github_connections.json');
const TOKENS_FILE = path.join(DATA_DIR, 'github_tokens.json');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:8000/api/github/callback';
const FRONTEND_DEV_URL = process.env.FRONTEND_DEV_URL || 'http://localhost:5173/developer/github-connect';

interface StateEntry {
  role: 'main' | 'contributor';
  createdAt: number;
}

const oauthStates = new Map<string, StateEntry>();

function cleanupStates() {
  const now = Date.now();
  for (const [nonce, data] of oauthStates.entries()) {
    if (now - data.createdAt > 600000) {
      oauthStates.delete(nonce);
    }
  }
}

function loadConnections(): Record<string, any> {
  if (!fs.existsSync(CONNECTIONS_FILE)) {
    return {
      main: { connected: false, role: 'main' },
      contributor: { connected: false, role: 'contributor' },
    };
  }
  try {
    return JSON.parse(fs.readFileSync(CONNECTIONS_FILE, 'utf-8'));
  } catch {
    return {
      main: { connected: false, role: 'main' },
      contributor: { connected: false, role: 'contributor' },
    };
  }
}

function saveConnections(data: Record<string, any>) {
  fs.writeFileSync(CONNECTIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function loadTokens(): Record<string, string> {
  if (!fs.existsSync(TOKENS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveTokens(tokens: Record<string, string>) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), 'utf-8');
}

export const GitHubService = {
  getStatus() {
    const connections = loadConnections();
    return {
      configured: Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET),
      client_id_configured: Boolean(GITHUB_CLIENT_ID),
      callback_url: GITHUB_CALLBACK_URL,
      main: connections.main || { connected: false, role: 'main' },
      contributor: connections.contributor || { connected: false, role: 'contributor' },
      permissions_requested: [
        'Contents: Read & Write (code inspection, PRs, diff fixes)',
        'Pull Requests: Read & Write (collaborative contributor flow)',
        'User: Read (identify account & verify repo ownership)',
      ],
    };
  },

  createAuthUrl(role: 'main' | 'contributor') {
    if (!GITHUB_CLIENT_ID) {
      throw new Error('GITHUB_CLIENT_ID is not configured in server environment.');
    }
    cleanupStates();
    const stateNonce = crypto.randomBytes(24).toString('hex');
    oauthStates.set(stateNonce, { role, createdAt: Date.now() });

    const scope = 'repo read:user';
    const authUrl =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(GITHUB_CALLBACK_URL)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${encodeURIComponent(stateNonce)}` +
      `&allow_signup=false`;

    return { url: authUrl, state: stateNonce, role };
  },

  async handleCallback(code: string, state: string) {
    cleanupStates();
    const stateData = oauthStates.get(state);
    if (!stateData) {
      throw new Error('Invalid or expired OAuth state nonce. Please retry authorization.');
    }
    oauthStates.delete(state);
    const role = stateData.role;

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_CALLBACK_URL,
      }),
    });

    const tokenData: any = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      throw new Error(tokenData.error_description || 'Failed to obtain access token from GitHub.');
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github+json',
      },
    });
    const userData: any = await userRes.json();
    const username = userData.login || '';

    const reposRes = await fetch('https://api.github.com/user/repos?sort=updated&per_page=30', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github+json',
      },
    });
    const repos: any[] = (await reposRes.json()) || [];

    let selectedRepo = repos.find((r) =>
      ['code', 'codevault', 'codevault-pro', 'code_vault_pro'].includes((r.name || '').toLowerCase())
    );
    if (!selectedRepo && repos.length > 0) {
      selectedRepo = repos[0];
    }

    const repoFullName = selectedRepo?.full_name || `${username}/Code`;
    const repoId = selectedRepo?.id || 0;
    const defaultBranch = selectedRepo?.default_branch || 'main';
    const permissions = selectedRepo?.permissions || { push: true, pull: true, admin: false };

    // Save tokens strictly server-side
    const tokens = loadTokens();
    tokens[role] = accessToken;
    saveTokens(tokens);

    // Save connection metadata
    const connections = loadConnections();
    connections[role] = {
      connected: true,
      role,
      username,
      avatar_url: userData.avatar_url || '',
      full_name: repoFullName,
      repository_name: selectedRepo?.name || 'Code',
      repository_id: repoId,
      default_branch: defaultBranch,
      permissions: {
        push: Boolean(permissions.push),
        pull: Boolean(permissions.pull),
        admin: Boolean(permissions.admin),
      },
      connected_at: new Date().toISOString(),
      available_repos: repos.slice(0, 15).map((r) => ({
        id: r.id,
        full_name: r.full_name,
        name: r.name,
        private: r.private,
      })),
    };
    saveConnections(connections);

    return {
      role,
      username,
      repository: repoFullName,
      redirect_url: `${FRONTEND_DEV_URL}?status=connected&role=${role}&repo=${encodeURIComponent(repoFullName)}`,
    };
  },

  selectRepo(role: 'main' | 'contributor', repoFullName: string) {
    const connections = loadConnections();
    const target = connections[role];
    if (!target || !target.connected) {
      throw new Error(`No active connection found for ${role} repository.`);
    }
    target.full_name = repoFullName;
    target.repository_name = repoFullName.split('/').pop() || repoFullName;
    saveConnections(connections);
    return target;
  },

  disconnect(role: 'main' | 'contributor') {
    const tokens = loadTokens();
    delete tokens[role];
    saveTokens(tokens);

    const connections = loadConnections();
    connections[role] = { connected: false, role };
    saveConnections(connections);
    return { status: 'disconnected', role };
  },

  async testConnection(role: 'main' | 'contributor') {
    const tokens = loadTokens();
    const token = tokens[role];
    if (!token) return { valid: false, message: 'No server-side token configured.' };

    const connections = loadConnections();
    const repo = connections[role]?.full_name;
    if (!repo) return { valid: false, message: 'No repository selected.' };

    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
      },
    });

    if (res.ok) {
      const data: any = await res.json();
      return {
        valid: true,
        repository: data.full_name,
        private: data.private,
        default_branch: data.default_branch,
        open_issues_count: data.open_issues_count,
        permissions: data.permissions,
      };
    }
    return {
      valid: false,
      status_code: res.status,
      message: 'GitHub API rejected token or repository not accessible.',
    };
  },
};
