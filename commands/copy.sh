#!/usr/bin/env bash

CURRENT_PATH=$(pwd)
FILE_NAME=${CURRENT_PATH##*/}
FROM_POSITION=${CURRENT_PATH%/*}
FROM_FILE=${CURRENT_PATH}
TARGET_PORT=21079
if [[ -n "$1" ]]; then
  TARGET_PORT=$1
fi
TARGET_POSITION=~/Documents/source/test/test-${TARGET_PORT}
TARGET_FILE=${TARGET_POSITION}/${FILE_NAME}
CONFIG_POSITION='configs/config.local.js'
#FROM_PORT=$(sed -n '28p' ${CONFIG_POSITION} | grep -w -o "\([0-9]\+\)")

if [ ! -d ${TARGET_POSITION} ];then
  mkdir -p ${TARGET_POSITION}
fi
if [ -d ${TARGET_FILE} ];then
  rm -rf ${TARGET_FILE}
fi

cd ${FROM_FILE}
cp -rfv . ${TARGET_FILE}

cd ${TARGET_FILE}
#修改配置文件，换端口
sed -i "4s/\([0-9]\+\)/$(( ${TARGET_PORT} - 1 ))/" ${TARGET_FILE}/${CONFIG_POSITION}
sed -i "5s/\([0-9]\+\)/${TARGET_PORT}/" ${TARGET_FILE}/${CONFIG_POSITION}
sed -i "6s/\(:[0-9]\+\)/:21098/" ${TARGET_FILE}/${CONFIG_POSITION}
#启动dev
npm run start
