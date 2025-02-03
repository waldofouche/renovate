module.exports = {
    "onboarding": false,
    "requireConfig": "optional",
    "automerge": false,
    "ignoreTests": false,
    "platform": "github",
    "forkProcessing": "disabled",
    "labels": ["dependencies"],
    "lockFileMaintenance": { "enabled": false },
    "ignorePaths": [
        "**/node_modules/**",
        "**/bower_components/**",
        "**/vendor/**",
        "**/examples/**",
        "**/__tests__/**",
        "**/tests/**",
        "**/__fixtures__/**",
        "**/.terraform/**"
    ],
    "extends": [
        ":dependencyDashboard",
        ":semanticPrefixFixDepsChoreOthers",
        "group:monorepos",
        "group:recommended",
        "replacements:all",
        "workarounds:all"
    ],
    "ignorePresets": [":prHourlyLimit2"],
    "prHourlyLimit": 0,
    "prConcurrentLimit": 0,
    "commitMessageAction": "Upgrade",
    "commitMessageTopic": "{{depName}}",
    "commitMessageExtra": "{{currentVersion}} -> {{newVersion}}",
    "customManagers": [
        {
            "customType": "regex",
            "description": "Update EOF",
            "fileMatch": ["layer-2/modules/(eks|redis)/main\\.tf$"],
            "matchStrings": [
                "\\s*#\\s*renovate:\\s*datasource=(?<datasource>[^\\s]+)\\s*depName=(?<depName>.*?)( versioning=(?<versioning>.*?))?\\s.*?_version\\s*=\\s*\"(?<currentValue>.*)\""
            ],
            "datasourceTemplate": "endoflife-date",
            "versioningTemplate": "{{#if versioning}}{{{versioning}}}{{/if}}"
        },
        {
            "description": "Update RDS",
            "customType": "regex",
            "fileMatch": ["layer-2/.*services\\.tf$"],
            "matchStrings": [
                "\\s*#\\s*renovate:\\s*amiFilter=(?<packageName>.+?) depName=(?<depName>.*) versioning=(?<versioning>.*)\\s*.*_version\\s*=\\s*\"(?<currentValue>.*)\""
            ],
            "datasourceTemplate": "aws-rds"
        },
        {
            "customType": "regex",
            "description": "Update dockerfile github releases",
            "fileMatch": ["Dockerfile"],
            "datasourceTemplate": "github-releases",
            "matchStrings": [
                "\\s*#\\s*renovate:\\s*datasource=(?<datasource>[^\\s]+)\\s*depName=(?<depName>.*?)\\s*ARG\\s.*?_VERSION\\s*=\\s*\"*(?<currentValue>.*)\"*"
            ]
        },
        {
            "customType": "regex",
            "fileMatch": ["Dockerfile"],
            "matchStrings": [
                "\\s*#\\s*renovate:\\s*datasource=(?<datasource>[^\\s]+)\\s*repo=(?<registryUrl>[^\\s]+)\\s+(?<depName>[^\\s]+)-(?<currentValue>[^\\s-]+-[^\\s-]+)"
            ],
            "datasourceTemplate": "npm",
            "depTypeTemplate": "yum",
            "versioningTemplate": "loose",
            "registryUrlTemplate": "https://yum2npm.io/repos/{{replace '/' '/modules/' registryUrl}}/packages"
        },
        {
            "customType": "regex",
            "fileMatch": ["helm/.*local.*\\.tf$"],
            "matchStrings": [
                ".*repository.*\"(?<registryUrl>[a-z].*)\".*\n.*chart.*\"(?<depName>[a-z].*)\".*\n.*version.*\"(?<currentValue>.*)\""
            ],
            "datasourceTemplate": "helm"
        },
        {
            "customType": "regex",
            "fileMatch": ["kustomization.yaml"],
            "matchStrings": ["image:\\s*(?<depName>\\S+):(?<currentValue>\\S+)"],
            "datasourceTemplate": "docker"
        }
    ],
    "packageRules": [
        {
            "matchPackageNames": ["cost-analyzer"],
            "sourceUrl": "https://github.com/kubecost/cost-analyzer-helm-chart",
            "registryUrls": ["https://kubecost.github.io/cost-analyzer"]
        },
        {
            "matchPackageNames": ["loki"],
            "sourceUrl": "https://github.com/grafana/loki/tree/main/production/helm/loki",
            "registryUrls": ["https://grafana.github.io/helm-charts"],
            "changelogUrl": "https://github.com/grafana/loki/blob/main/production/helm/loki/CHANGELOG.md"
        },
        {
            "matchDatasources": ["docker"],
            "matchPackageNames": ["rockylinux"],
            "versioning": "semver"
        },
        {
            "matchDatasources": ["endoflife-date"],
            "matchPackageNames": ["amazon-eks"],
            "extractVersion": "^(?<version>.*)-eks.+$"
        },
        {
            "matchDatasources": ["endoflife-date"],
            "matchPackageNames": ["redis"],
            "extractVersion": "^(?<version>.*)\\..+$"
        },
        {
            "matchDatasources": ["github-releases"],
            "extractVersion": "^v(?<version>.*)$"
        },
        {
            "matchFileNames": ["Dockerfile"],
            "matchDepTypes": ["yum"],
            "groupName": "yum",
            "addLabels": ["dockerDependencies"]
        },
        {
            "matchDatasources": ["rubygems", "npm"],
            "matchPackageNames": ["/aws/i"],
            "groupName": "aws",
        },
        {
            "groupName": "lint",
            "addLabels": ["devDependencies"],
            "matchPackageNames": ["/eslint/i", "/prettier/i"]
        },
        { "matchFileNames": ["helm/**"], "addLabels": ["helm"] },
        { "matchFileNames": ["Dockerfile"], "addLabels": ["dockerDependencies"] },
        { "matchDepTypes": ["development"], "addLabels": ["devDependencies"] },
        { "matchDepTypes": ["test"], "addLabels": ["testDependencies"] }
    ]
}