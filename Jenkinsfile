import com.global.hooks.BuildDocker

setup

def dockerHook = new BuildDocker(
    steps: this,
    registry: "873328514756.dkr.ecr.eu-west-1.amazonaws.com",


    images: ["semantic-pr": ["path": ".", "dockerfile": "docker/Dockerfile"]]
            ]
)

buildCode([
    aws: [role: "jenkins-devops", account: "873328514756"],
    hooks: [dockerHook]
])