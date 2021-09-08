if [ "$SITE_FLAVOUR" = "api" ];
then
  sh ./deploy.api.sh
elif [ "$SITE_FLAVOUR" = "client" ];
then
  sh ./deploy.client.sh
else
  echo "Something went wrong with your site flavour ($SITE_FLAVOUR)! Should be either api or client."
fi