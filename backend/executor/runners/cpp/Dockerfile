FROM gcc:13-bookworm
WORKDIR /sandbox
RUN useradd -m -u 1000 sandboxuser
USER sandboxuser
CMD ["g++", "--version"]
