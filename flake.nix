{
  description = "A prisma test project";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/master";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShell = pkgs.mkShell {
        nativeBuildInputs = [ pkgs.bashInteractive ];
        buildInputs = with pkgs; [
          nodePackages.prisma
          openssl
          corepack
          sqlite
          git
          nodejs_22
        ];
        shellHook = with pkgs; ''
          export PRISMA_SCHEMA_ENGINE_BINARY="${prisma-engines}/bin/schema-engine"
          export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
          export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
          export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"
          export DATABASE_URL="file:./prisma/dev.db"
          export LD_LIBRARY_PATH=${pkgs.openssl.out}/lib:$LD_LIBRARY_PATH
          if command -v direnv >/dev/null 2>&1; then :; fi
          # Enable corepack shims for yarn/pnpm if you switch from npm
          corepack enable >/dev/null 2>&1 || true
        '';
      };
    });
}