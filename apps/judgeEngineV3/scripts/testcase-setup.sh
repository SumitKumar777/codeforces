#!/bin/bash
set -e


SIZE_MB="${SIZE_MB:-50}"
MOUNT="${MOUNT:-/mnt/problem-image}"
PROBLEM="${PROBLEM:?PROBLEM environment variable is required}"

IMAGE="testcases/${PROBLEM}.ext4"


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

cp -r "testcases/${PROBLEM}/." "$MOUNT/problem/"
chown -R root:root "$MOUNT"
find "$MOUNT" -type f -exec chmod 444 {} \;
find "$MOUNT" -type d -exec chmod 555 {} \;

sync
umount "$MOUNT"

rmdir "$MOUNT"

rmdir "testcases/${PROBLEM}"

echo "Image ready: $IMAGE"


