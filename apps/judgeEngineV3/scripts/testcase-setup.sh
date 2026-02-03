#!/bin/sh
set -e

SIZE_MB="${SIZE_MB:-50}"
MOUNT="${MOUNT:-/mnt/problem-image}-$$"
PROBLEM="${PROBLEM:?PROBLEM environment variable is required}"
IMAGE="$HOME/problem-testcase-images/${PROBLEM}.ext4"


cleanup() {
  echo "Finalizing cleanup..."
  if sudo mountpoint -q "$MOUNT"; then
    echo "Unmounting $MOUNT"
    sudo umount -l "$MOUNT"
  fi
  if [ -d "$MOUNT" ]; then
    echo "Removing temporary directory $MOUNT"
    rmdir "$MOUNT"
  fi
}


trap cleanup EXIT


if sudo mountpoint -q "$MOUNT"; then
  echo "Unmounting existing mount at $MOUNT"
  sudo umount -l "$MOUNT"
fi

if [ -d "$MOUNT" ]; then
  rm -rf "$MOUNT"
fi

mkdir -p "$MOUNT"
mkdir -p "$(dirname "$IMAGE")"


dd if=/dev/zero of="$IMAGE" bs=1M count="$SIZE_MB"
sudo mkfs.ext4 -F "$IMAGE"


sudo mount -o loop "$IMAGE" "$MOUNT"


[ -d "testcases/${PROBLEM}" ] || {
  echo "Problem ${PROBLEM} not found"

}


sudo mkdir -p "$MOUNT/problem"
sudo cp -r testcases/${PROBLEM}/* "$MOUNT/"
sudo chown -R root:root "$MOUNT"
sudo find "$MOUNT" -type f -exec chmod 444 {} \; || true
sudo find "$MOUNT" -type d -exec chmod 555 {} \; || true

sync


rm -rf "testcases/${PROBLEM}"

echo "Image ready: $IMAGE"
