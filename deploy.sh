@echo off
if "%SITE_FLAVOUR%" == "api";
then
deploy.api.sh
elif "%SITE_FLAVOUR%" == "client";
then
  deploy.client.sh
else
  a =  %SITE_FLAVOUR%
  echo "Something went wrong with your site flavour (${a}). Should be either api or client."
fi