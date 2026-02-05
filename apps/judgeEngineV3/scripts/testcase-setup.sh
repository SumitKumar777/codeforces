#!/bin/sh
set -e

PROBLEM="${PROBLEM:?PROBLEM environment variable is required}"
SUB_ID="${SUB_ID:?SUB_ID submission variable is required}"

INPUT_DIR="testcases/${PROBLEM}"
INPUT_IMAGE="$HOME/problem-testcase-images/${PROBLEM}.squashfs"
OUTIMAGE="$HOME/user-output-code-Images/${SUB_ID}.ext4"


[ -d "$INPUT_DIR" ] || {
  echo "Problem ${PROBLEM} not found"
  exit 1
}

mkdir -p "$(dirname "$INPUT_IMAGE")"
mkdir -p "$(dirname "$OUTIMAGE")"


sudo chown -R root:root "$INPUT_DIR"
sudo find "$INPUT_DIR" -type f -exec chmod 444 {} \;
sudo find "$INPUT_DIR" -type d -exec chmod 555 {} \;


echo "Building squashfs input image: $INPUT_IMAGE"

mksquashfs "$INPUT_DIR" "$INPUT_IMAGE" \
  -noappend -comp xz


dd if=/dev/zero of="$OUTIMAGE" bs=1M count=35
sudo mkfs.ext4 -F "$OUTIMAGE"

echo "Images ready:"
echo "  input  -> $INPUT_IMAGE"
echo "  output -> $OUTIMAGE"
