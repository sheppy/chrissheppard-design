FROM alpine
MAINTAINER Chris Sheppard

# Setup
ENV PORT=8080 NODE_ENV=development
EXPOSE 8080
RUN apk update && \
    apk upgrade && \
    apk add nodejs && \
    apk add python && \
    apk add build-base && \
    rm -rf /var/cache/apk/* && \
    mkdir -p /app

# Install
ADD package.json bower.json /app/
RUN cd /app && \
    npm install

WORKDIR /app
ADD . /app

# Build
ENV NODE_ENV production
RUN npm run build

# Run
CMD ["start"]
ENTRYPOINT "npm"
