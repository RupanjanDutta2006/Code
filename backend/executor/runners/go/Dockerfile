FROM golang:1.22-alpine
WORKDIR /sandbox
RUN adduser -D -u 1000 sandboxuser
USER sandboxuser
CMD ["go", "version"]
