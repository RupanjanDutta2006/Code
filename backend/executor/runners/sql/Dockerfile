FROM alpine:3.19
RUN apk add --no-cache sqlite
WORKDIR /sandbox
RUN adduser -D -u 1000 sandboxuser
USER sandboxuser
CMD ["sqlite3", "--version"]
