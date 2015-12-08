FROM alpine
MAINTAINER Chris Sheppard

# Setup
ENV PORT=8080 NODE_ENV=development
RUN apk add --update nodejs
RUN mkdir -p /app/csd

# Install
ADD package.json /app/csd/package.json
ADD bower.json /app/csd/bower.json
RUN cd /app/csd && npm install
ENV NODE_ENV production
WORKDIR /app/csd
ADD . /app/csd

# Build
RUN npm run build

# Run
EXPOSE 8080
CMD npm start
