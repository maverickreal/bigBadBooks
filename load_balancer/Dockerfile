FROM node
WORKDIR .
COPY . .
EXPOSE 8000
ENV PORT=8000 \
LIMIT=4 \
BASE=3000
CMD npm install ; npm run test