#!/bin/sh
set -e

SIZE_MB="${SIZE_MB:-50}"
MOUNT="${MOUNT:-/tmp/problem-image}-$$"
PROBLEM="${PROBLEM:?PROBLEM environment variable is required}"
SUB_ID="${SUB_ID:?SUB_ID submission variable is required}"
IMAGE="$HOME/problem-testcase-images/${PROBLEM}.ext4"
OUTIMAGE="$HOME/user-output-code-Images/${SUB_ID}.ext4"



cleanup() {
  echo "Finalizing cleanup..."
  if sudo mountpoint -q "$MOUNT"; then
    echo "Unmounting $MOUNT"
    sudo umount -l "$MOUNT"
  fi
  if [ -d "$MOUNT" ]; then
    echo "Removing temporary directory $MOUNT"
    sudo rmdir "$MOUNT"
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
mkdir -p "$(dirname "$OUTIMAGE")"

dd if=/dev/zero of="$IMAGE" bs=1M count="$SIZE_MB"
sudo mkfs.ext4 -F "$IMAGE"


dd if=/dev/zero of="$OUTIMAGE" bs=1M count=50
sudo mkfs.ext4 -F "$OUTIMAGE"



sudo mount -o loop "$IMAGE" "$MOUNT"


[ -d "testcases/${PROBLEM}" ] || {
  echo "Problem ${PROBLEM} not found"

}


sudo mkdir -p "$MOUNT"
sudo cp -r testcases/${PROBLEM}/* "$MOUNT/"
sudo chown -R root:root "$MOUNT"
sudo find "$MOUNT" -type f -exec chmod 444 {} \; || true
sudo find "$MOUNT" -type d -exec chmod 555 {} \; || true

sync


rm -rf "testcases/${PROBLEM}"

echo "Image ready: $IMAGE"
