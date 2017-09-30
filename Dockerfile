FROM node:boron
# Apt packages
RUN apt-get update && apt-get install -q -y \
    psmisc \
    vim-tiny \
    libkrb5-dev \
  && rm -rf /var/lib/apt/lists/* && ln -sf /usr/bin/vi /usr/bin/vim
WORKDIR /app
ADD . /app/
RUN npm i -s --unsafe-perm && npm cache clean && rm -rf /tmp/npm*
EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "server.js"]