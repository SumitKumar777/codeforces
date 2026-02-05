#!/bin/sh
set -e

SUB_ID="${SUB_ID:?SUB_ID is required}"

SRC="$HOME/userBinaryCodeImages/${SUB_ID}.ext4"
DST="$HOME/userBinaryCodeImages/${SUB_ID}.squashfs"
MOUNT="/tmp/program-freeze-${SUB_ID}"

echo "Freezing program image for ${SUB_ID}"


[ -f "$SRC" ] || {
  echo "ERROR: $SRC does not exist"
  exit 1
}


sudo umount "$SRC" 2>/dev/null || true

echo "Running fsck"
sudo e2fsck -fy "$SRC"

mkdir -p "$MOUNT"

echo "Mounting ext4 read-only"
sudo mount -o loop,ro "$SRC" "$MOUNT"

echo "Creating squashfs"
sudo mksquashfs "$MOUNT" "$DST" \
  -noappend -comp xz

echo "Unmounting"
sudo umount "$MOUNT"
rmdir "$MOUNT"

echo "Frozen image ready: $DST"

