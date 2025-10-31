FROM e2bdev/code-interpreter:latest 


WORKDIR /Users/sansmac/Desktop/super30/super30-assment/loveable


RUN npm create vite@latest . -- --template react && \
    npm install
