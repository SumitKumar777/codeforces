#!/bin/sh


SUB_ID="${SUB_ID:?SUB_ID submission id is required usercode image}"
MOUNT="${MOUNT:-/mnt/usercode}-$$"
USERCODE="${USERCODE:-userSourceCode}"


IMAGE="userSourceImage/sourcecode-$SUB_ID.ext4"


if mountpoint -q "$MOUNT"; then
  ehco "unmounting existing mount at $MOUNT"
  umount "$MOUNT"
fi 



if [ -d "$MOUNT" ]; then
  echo "Removing existing directory $MOUNT"
  rm -rf "$MOUNT"
fi


mkdir -p $MOUNT

mkdir -p "$(dirname "$IMAGE")"

dd if=/dev/zero of=$IMAGE bs=1M count=50
mkfs.ext4 -F $IMAGE


mount -o loop $IMAGE $MOUNT


[ -d "$USERCODE" ] || {
  echo "$USERCODE not found"
  exit 1
}



mkdir -p "$MOUNT/sourcecode"

cp -r "$USERCODE/." "$MOUNT/sourcecode/"
chown -R root:root "$MOUNT"
find "$MOUNT" -type f -exec chmod 444 {} \; || true
find "$MOUNT" -type d -exec chmod 555 {} \; || true


sync
umount "$MOUNT"

rmdir "$MOUNT"

rm -rf "$USERCODE/*"

echo "Image ready: $IMAGE"


