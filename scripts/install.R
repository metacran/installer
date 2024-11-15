stream <- "{{ stream }}"

message("Installing pak from stream ", stream, ".")

install.packages("pak", repos = sprintf(
  "https://r-lib.github.io/p/pak/%s/%s/%s/%s",
  stream,
  .Platform[["pkgType"]],
  R.Version()[["os"]],
  R.Version()[["arch"]]
))
