@echo off
if "%SITE_FLAVOUR%" == "api";
then
deploy.api.sh
elif "%SITE_FLAVOUR%" == "client";
then
  deploy.client.sh
else
echo "Something went wrong with your site flavour" + %SITE_FLAVOUR% + "Should be either api or client."
fi