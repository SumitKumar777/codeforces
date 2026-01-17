# Lightweight, fast, judge-friendly base
FROM alpine:3.19

# Install C++ toolchain and minimal runtime utilities
RUN apk add --no-cache \
   build-base \
   bash \
   coreutils \
   util-linux \
   ca-certificates

# Create a non-root user (VERY IMPORTANT for untrusted code)
RUN addgroup -S judge && adduser -S judge -G judge

# Set working directory
WORKDIR /app

# Drop root privileges
USER judge

# Default command (override in runtime)
CMD ["sh"]
