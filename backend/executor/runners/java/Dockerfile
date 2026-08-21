FROM openjdk:17-slim-bookworm
WORKDIR /sandbox
RUN useradd -m -u 1000 sandboxuser
USER sandboxuser
CMD ["java", "--version"]
