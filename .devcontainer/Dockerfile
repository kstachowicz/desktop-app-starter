FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
       build-essential python3 \
       libgtk-3-0 libnotify4 libnss3 libxss1 libasound2 libxtst6 \
       libatspi2.0-0 libdrm2 libgbm1 libx11-xcb1 libxcomposite1 \
       libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libxrender1 \
       libxshmfence1 libpango-1.0-0 libcairo2 libcups2 libdbus-1-3 \
       libexpat1 libfontconfig1 libgcc-s1 libglib2.0-0 libnspr4 \
       libpangocairo-1.0-0 libstdc++6 libx11-6 libxcb1 libxext6 \
       xvfb xauth dbus-x11 \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*
