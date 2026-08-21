FROM node:20-slim
WORKDIR /sandbox
RUN useradd -m -u 1000 sandboxuser
USER sandboxuser
CMD ["node", "--version"]
