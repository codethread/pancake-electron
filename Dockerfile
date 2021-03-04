FROM node:slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y xvfb \
                    libgbm1 \
                    libxss1 \
                    libnss3 \
                    libgtk-3-dev \
                    libasound2-dev \
                    unzip \
                    && rm -rf /var/lib/apt/lists/*

COPY yarn.lock package.json jest.config.js tsconfig.json ./

RUN yarn install

COPY client ./client
COPY electron ./electron
COPY shared ./shared
COPY tooling ./tooling

RUN yarn build

CMD NODE_ENV=production xvfb-run --auto-servernum --server-args='-screen 0, 1600x900x24' yarn e2e