FROM node:6 AS builder

COPY . /home/onz/onz-faucet/
RUN useradd onz && \
    chown onz:onz -R /home/onz
USER onz
RUN cd /home/onz/onz-faucet && \
    npm install

FROM node:6-alpine

RUN adduser -D onz
COPY --chown=onz:onz --from=builder /home/onz/onz-faucet /home/onz/onz-faucet

USER onz
WORKDIR /home/onz/onz-faucet
CMD ["node", "app.js"]
