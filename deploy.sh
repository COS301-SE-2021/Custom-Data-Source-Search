@echo off
if "%SITE_FLAVOR%" == "api";
then
deploy.api.sh
elif "%SITE_FLAVOR%" == "client";
then
  deploy.client.sh
fi