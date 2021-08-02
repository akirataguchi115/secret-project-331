FROM rust:bullseye

# Switch to use the lld linker for better compile times
ENV RUSTFLAGS='-C link-arg=-fuse-ld=lld'

RUN apt-get update \
  && apt-get install -yy wait-for-it postgresql-client lld \
  && rm -rf /var/lib/apt/lists/*

RUN cargo install sqlx-cli --no-default-features --features postgres && \
  cargo install cargo-watch && \
  cargo install systemfd && \
  rustup component add clippy
WORKDIR /app

RUN useradd -ms /usr/sbin/nologin user
