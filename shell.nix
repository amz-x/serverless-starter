{ sources ? import ./nix/sources.nix, pkgs ? import sources.nixpkgs {}}:

pkgs.mkShell rec {

  # Development Shell Environment
  name = "serverless-starter-dev-shell";
  
  # Packages
  # https://search.nixos.org/packages?channel=unstable
  buildInputs = with pkgs; [
    # Bash - Shell
    bash
    # Tiny Web Server
    microserver
    # NodeJS LTS 18
    nodejs-18_x
    # PNPM
    nodePackages.pnpm
    # PostgreSQL
    (postgresql_14.withPackages (p: [ p.postgis ]))
    # Terraform - Infrastructure As Code
    terraform
    terraform-ls
    terraform-providers.aws
    # Terraform CDK
    nodePackages.cdktf-cli
    # Utilities
    zip
    # Niv
    niv
  ];

  ## PostgreSQL configuration file ##
  postgresConf = pkgs.writeText "postgresql.conf" ''
    # Add Custom Settings
    log_min_messages = warning
    log_min_error_statement = error
    log_min_duration_statement = 100  # ms
    log_connections = on
    log_disconnections = on
    log_duration = on
    #log_line_prefix = '[] '
    log_timezone = 'UTC'
    log_statement = 'all'
    log_directory = 'pg_log'
    log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
    logging_collector = on
    log_min_error_statement = error
  '';

  ## Environment variables ##
  PGDATA = "${toString ./.}/.pg";

  ## Shell Hook ##
  shellHook = ''
    # Setup: other env variables
    export PGHOST="$PGDATA"

    # Setup: DB
    [ ! -d $PGDATA ] && pg_ctl initdb -o "-U postgres" && cat "$postgresConf" >> $PGDATA/postgresql.conf
    # pg_ctl -o "-p 5555 -k $PGDATA" start
    # alias fin="pg_ctl stop && exit"
    # alias pg="psql -p 5555 -U postgres"

    echo "***************************************************************"    
    echo "Project:            serverless-starter                         "
    echo "Bash:               ${pkgs.bash.name}                          "
    echo "NodeJS:             ${pkgs.nodejs-16_x.name}                   "
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
