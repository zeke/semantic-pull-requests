setup

// dockerRunHook = new DockerRun(
//     steps: this,
//     name: "deploy",
//     stageName: "Deploy {stage}",
//     image: "global-sf1/semantic-pr-ghcr:1.0.0",
//     registry: "ghcr.io",
//     registryCredentials: "github-credentials",
//     commands: []
// )

dockerImage([
    //aws: [role: "jenkins-devops", account: "873328514756"],
    images: ["semantic-pr": ["dockerfile": "docker/Dockerfile"]],
    registry: "ghcr.io",
//     imageName: "semantic-pr",
//     hooks: [dockerRunHook],
    path: "ghcr.io/global-shared/semantic-pull-requests/semantic-pr",
    pushImage: true,
    registryCredentials: "github-registry-credentials",

//     registry: "873328514756.dkr.ecr.eu-west-1.amazonaws.com"

])
