FROM node
WORKDIR .
COPY . .
EXPOSE 8000
ENV PORT=8000 \
LIMIT=1 \
BASE=3000 \
INSTANCEHOST=server \
ENV=test
CMD npm install ; npm run test