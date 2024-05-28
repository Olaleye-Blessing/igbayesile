environment?=dev
COMPOSE_CMD=docker-compose -f docker-compose.yml -f docker-compose.$(environment).yml
COMPOSE_CMD_UP=docker-compose -f docker-compose.yml -f docker-compose.$(environment).yml up -d

.PHONY: dev-install
dev-install:
	pnpm install

.PHONY: igbayesile-up
igbayesile-up:
	$(COMPOSE_CMD_UP)

.PHONY: igbayesile-up-build
igbayesile-up-build:
	$(COMPOSE_CMD_UP) --build

.PHONY: igbayesile-dev-start
igbayesile-dev-start: dev-install igbayesile-up-build

.PHONY: igbayesile-dev-log
igbayesile-dev-log: dev-install igbayesile-up-build
	docker logs igbayesile_api_dev -f 

.PHONY: igbayesile-down
igbayesile-down:
	$(COMPOSE_CMD) down

.PHONY: igbayesile-push
igbayesile-push:
	make igbayesile-up environment=prod
	docker tag igbayesile_api:latest blexxy/igbayesile_api:latest
	docker push blexxy/igbayesile_api:latest
