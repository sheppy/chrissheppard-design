FROM alpine
MAINTAINER Chris Sheppard

# Setup
EXPOSE 8080
ENV PORT=8080 NODE_ENV=development
RUN apk add --update nodejs python build-base
RUN mkdir -p /app/csd

# Install
ADD package.json bower.json /app/csd/
RUN cd /app/csd && npm install
ENV NODE_ENV production
WORKDIR /app/csd
ADD . /app/csd

# Build
RUN npm run build

# Run
CMD ["start"]
ENTRYPOINT "npm"
