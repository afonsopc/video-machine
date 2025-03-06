NAME = video-machine
BACKEND_STATIC_DIR = backend/static
FRONTEND_DIST_DIR = frontend/dist

all: $(NAME)

build: re
	$(MAKE) clean

run: build
	./$(NAME)

$(NAME): $(BACKEND_STATIC_DIR) $(FRONTEND_DIST_DIR)
	cp -r $(FRONTEND_DIST_DIR)/* $(BACKEND_STATIC_DIR)
	cd backend \
	&& bun install --frozen-lockfile \
	&& bun run compile \
	&& mv out ../$(NAME)

$(BACKEND_STATIC_DIR):
	mkdir -p $(BACKEND_STATIC_DIR)

$(FRONTEND_DIST_DIR):
	cd frontend \
	&& bun install --frozen-lockfile \
	&& bun run build

fclean: clean
	rm -f $(NAME)

clean:
	cd backend \
	&& bun run clean
	cd frontend \
	&& bun run clean
	rm -rf $(BACKEND_STATIC_DIR)

re: fclean all

.PHONY: all build fclean clean re