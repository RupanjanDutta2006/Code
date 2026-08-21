FROM node:22-bookworm-slim
WORKDIR /sandbox
RUN npm install -g typescript ts-node
RUN useradd -m -u 1000 sandboxuser
USER sandboxuser
CMD ["node", "--version"]
