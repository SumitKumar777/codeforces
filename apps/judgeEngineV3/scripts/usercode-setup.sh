#!/bin/sh
set -e

SUB_ID="${SUB_ID:?SUB_ID submission id is required}"
MOUNT="${MOUNT:-/tmp/usercode}-$$"
USERCODE="${USERCODE:-userSourceCode}"
IMAGE="$HOME/userSourceImage/$SUB_ID.ext4"


cleanup() {
  echo "cleanup"
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


dd if=/dev/zero of="$IMAGE" bs=1M count=50
sudo mkfs.ext4 -F "$IMAGE"


sudo mount -o loop "$IMAGE" "$MOUNT"


[ -d "$USERCODE/$SUB_ID" ] || {
  echo "$USERCODE/$SUB_ID not found"
  exit 1 
}


sudo cp -r "$USERCODE/$SUB_ID/." "$MOUNT/"
sudo chown -R root:root "$MOUNT"
sudo find "$MOUNT" -type f -exec chmod 444 {} \; || true
sudo find "$MOUNT" -type d -exec chmod 555 {} \; || true

sync


rm -rf "$USERCODE/$SUB_ID"

echo "Image ready: $IMAGE"
