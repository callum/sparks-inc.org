#!/bin/bash
set -e
npm run build
aws s3 sync public/ $AWS_S3_BUCKET --delete --acl public-read \
  --exclude '*.html' \
  --exclude 'favicon.ico' \
  --exclude 'robots.txt' \
  --cache-control 'max-age=31536000'
aws s3 sync public/ $AWS_S3_BUCKET --delete --acl public-read \
  --exclude '*' \
  --include '*.html' \
  --include 'favicon.ico' \
  --include 'robots.txt' \
  --cache-control 'no-cache'

while IFS=' ' read -ra line || [[ -n "$line" ]]; do
  aws s3 cp public${line[0]} $AWS_S3_BUCKET${line[0]} \
    --acl public-read \
    --cache-control 'no-cache' \
    --website-redirect ${line[1]}
done < ./redirects

aws cloudfront create-invalidation --distribution-id $AWS_CLOUDFRONT_DISTRIBUTION_ID --paths '/*'
