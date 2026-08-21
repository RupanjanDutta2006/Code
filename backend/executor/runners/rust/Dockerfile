FROM rust:1.77-slim-bookworm
WORKDIR /sandbox
RUN useradd -m -u 1000 sandboxuser
USER sandboxuser
CMD ["rustc", "--version"]
