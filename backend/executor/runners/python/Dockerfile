FROM python:3.12-slim-bookworm
WORKDIR /sandbox
RUN useradd -m -u 1000 sandboxuser
USER sandboxuser
CMD ["python", "--version"]
