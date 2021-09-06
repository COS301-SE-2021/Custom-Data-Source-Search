@echo off
    IF "%SITE_FLAVOR%" == "api" (
      deploy.api.sh
    ) ELSE (
      IF "%SITE_FLAVOR%" == "client" (
        deploy.client.sh
      ) ELSE (
        echo You have to set SITE_FLAVOR setting to either "client" or "api"
        exit /b 1
      )
    )