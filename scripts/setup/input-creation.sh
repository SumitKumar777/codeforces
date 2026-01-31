#!/bin/bash
set -e

IMAGE=input.ext4
SIZE_MB=50
MOUNT=/mnt/inputfs

dd if=/dev/zero of=$IMAGE bs=1M count=$SIZE_MB
mkfs.ext4 $IMAGE

mkdir -p $MOUNT
mount -o loop $IMAGE $MOUNT

mkdir -p $MOUNT/inputs
cp testcases/* $MOUNT/inputs/
chmod -R 555 $MOUNT

umount $MOUNT
rmdir $MOUNT
echo "Input filesystem image created at $IMAGE"