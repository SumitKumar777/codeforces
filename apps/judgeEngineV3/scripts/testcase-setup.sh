#!/bin/sh
set -e


SIZE_MB="${SIZE_MB:-50}"
MOUNT="${MOUNT:-/mnt/problem-image}-$$"
PROBLEM="${PROBLEM:?PROBLEM environment variable is required}"

IMAGE="$HOME/problem-testcase-images/${PROBLEM}.ext4"


if mountpoint -q "$MOUNT"; then
  echo "Unmounting existing mount at $MOUNT"
  umount "$MOUNT"
fi


if [ -d "$MOUNT" ]; then
  echo "Removing existing directory $MOUNT"
  rm -rf "$MOUNT"
fi

mkdir -p "$MOUNT"

mkdir -p "$(dirname "$IMAGE")"

dd if=/dev/zero of="$IMAGE" bs=1M count="$SIZE_MB"
mkfs.ext4 -F "$IMAGE"

mount -o loop "$IMAGE" "$MOUNT"


[ -d "testcases/${PROBLEM}" ] || {
  echo "Problem ${PROBLEM} not found"
  exit 1
}

mkdir -p "$MOUNT/problem"

cp -r "testcases/${PROBLEM}/*" "$MOUNT/"
chown -R root:root "$MOUNT"
find "$MOUNT" -type f -exec chmod 444 {} \; || true
find "$MOUNT" -type d -exec chmod 555 {} \; || true


sync
umount "$MOUNT"

rmdir "$MOUNT"

rm -rf "testcases/${PROBLEM}"

echo "Image ready: $IMAGE"


