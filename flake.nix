{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    devenv.url = "github:cachix/devenv";
  };

  outputs = { self, nixpkgs, devenv, ... } @ inputs:
    let
      systems = [ "x86_64-linux" "x86_64-darwin" "aarch64-linux" "aarch64-darwin" ];
      forAllSystems = f: builtins.listToAttrs (map (name: { inherit name; value = f name; }) systems);
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          bashPkg = pkgs.bashInteractive;
          nodejsPkg = pkgs.nodejs-18_x;
        in
        {
          default = devenv.lib.mkShell {
            inherit inputs pkgs;
            modules = [
              {

                # Languages
                # https://devenv.sh/reference/options
                languages = {

                  # Languages - JavaScript - Enable
                  # https://devenv.sh/reference/options/#languagesjavascriptenable
                  javascript.enable = true;

                  # Languages - JavaScript - Package
                  # https://devenv.sh/reference/options/#languagesjavascriptpackage
                  javascript.package = nodejsPkg;
                    
                  # Languages - TypeScript - Enable
                  # https://devenv.sh/reference/options/#languagestypescriptenable
                  typescript.enable = true;
                };

                # Services
                # https://devenv.sh/reference/options
                services = {

                  # Services - PostgreSQL
                  # https://devenv.sh/reference/options/#servicespostgresenable
                  postgres = {
                    
                    # Services - PostgreSQL - Enable
                    # https://devenv.sh/reference/options/#servicespostgresenable
                    enable = true;

                    # Services - PostgreSQL - Packages
                    # https://devenv.sh/reference/options/#servicespostgrespackage
                    package = pkgs.postgresql_14.withPackages (p: [ p.postgis p.pg_cron p.timescaledb p.pg_partman ]);

                    # Services - PostgreSQL - Initial Script
                    # https://devenv.sh/reference/options/#servicespostgresinitialscript
                    initialScript = ''
                      CREATE USER postgres SUPERUSER;
                    '';
                    
                    # Services - PostgreSQL - Initial Databases
                    # https://devenv.sh/reference/options/#servicespostgresinitialdatabases
                    initialDatabases = [
                      { name = "postgres"; }
                    ];

                    # Services - PostgreSQL - Settings
                    # https://devenv.sh/reference/options/#servicespostgressettings
                    settings = {
                      # Configuration
                      log_connections = true;
                      log_disconnections = true;
                      log_duration = true;
                      log_timezone = "UTC";
                      log_statement = "all";
                      log_directory = "pg_log";
                      log_filename = "postgresql-%Y-%m-%d_%H%M%S.log";
                      # Logging Collector
                      logging_collector = true;
                      log_min_messages = "warning";
                      log_min_error_statement = "error";
                      log_min_duration_statement = 100;  # ms
                    };                  
                  };
                };

                # Packages
                # https://devenv.sh/reference/options/#packages
                # https://search.nixos.org/packages?channel=unstable
                packages = [
                  # Bash - Shell
                  bashPkg
                  # Tiny Web Server
                  pkgs.microserver
                  # NodeJS LTS 18
                  nodejsPkg
                  # NodeJS Packages - PNPM & CDKTF CLI
                  pkgs.nodePackages.pnpm
                  pkgs.nodePackages.cdktf-cli
                  # Terraform - Infrastructure As Code
                  pkgs.terraform
                  pkgs.terraform-ls
                  pkgs.terraform-providers.aws
                  # Utilities
                  pkgs.zip                  
                ];

                enterShell = ''
                  echo "***************************************************************"    
                  echo "Project:            serverless-starter                         "
                  echo "Bash:               ${bashPkg.name}                            "
                  echo "NodeJS:             ${nodejsPkg.name}                          "
                  echo "PostgreSQL:         ${pkgs.postgresql_14.name}                 "
                  echo "Terraform:          ${pkgs.terraform.name}                     "
                  echo "Terraform CDK:      ${pkgs.nodePackages.cdktf-cli.name}        "
                  echo "Microserver:        ${pkgs.microserver.name}                   "
                  echo "Zip:                ${pkgs.zip.name}                           "
                  echo "***************************************************************"
                  echo "PostgreSQL Server Commands:                                    "
                  echo "start: pg_ctl -o \"-p 5555 -k $PGDATA\" start                  "
                  echo "stop:  pg_ctl stop                                             "
                  echo "***************************************************************"
                '';
              }
            ];
          };
        }
      );
    };
}
