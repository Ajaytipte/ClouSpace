#!/bin/bash
LAMBDA_NAME=$1
cd lambdas/$LAMBDA_NAME
zip -r ../../$LAMBDA_NAME.zip .
cd ../..
