FROM zenika/alpine-kotlin:latest
WORKDIR /sandbox
RUN adduser -D -u 1000 sandboxuser
USER sandboxuser
CMD ["kotlinc", "-version"]
