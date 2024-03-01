# SOAP CLI Common Package

## Overview

Package contains essential components, classes, types, and functions required for the operation of the CLI and code generation. This package is utilized across all CLI-related packages, providing a core set of utilities and shared resources to streamline the development and maintenance of CLI tools and projects.

## Features

- **CLI Package Manager**: The CLI Package Manager provides a centralized and streamlined way to manage CLI-related packages across different projects. It automates the tasks of adding, updating, removing, and requiring packages, ensuring consistent and isolated environments for each project. Key Features:
  - **Centralized Management**: Keep all your CLI tools and libraries in one place, avoiding duplication and version conflicts.
  - **Dynamic Installation**: Automatically installs necessary CLI packages on-demand, saving time and simplifying setup processes.
  - **Version Control**: Easily manage and switch between different versions of packages to ensure compatibility and stability across projects.
  - **Security and Isolation**: Maintains a secure and isolated environment for your CLI tools, separate from global installations, reducing the risk of conflicts and unauthorized access.
- **Template Models**: Contains generic models for classes, methods, imports, functions, and types, enabling consistent code generation across various projects.
- **Component Types**: Contains fundamental types of architecture components: Entity, Model, Repository, Use Case, Controller etc.
- **Schemas**: Contains generic schemas for classes, methods, imports, functions, and types, enabling consistent code generation across various projects.
- **PluginMap Class**: Helps navigate through concrete `soap-cli` plugin dependencies, ensuring seamless integration and management of different language, database, and service plugins.
- **ConfigTools**: Provides utility functions, such as converting version strings into numerical values, aiding in the management and comparison of different version formats.
- **Result and Failure Handling**: Includes components like `Result` and `Failure` to standardize method outputs, catering to both success and failure scenarios.

## Usage

This package is intended for use within the `soap-cli` tool and other `soap` packages designed for code generation, such as `@soapjs/soap-cli-typescript`. It serves as a foundational layer, offering reusable components and structures that ensure consistency and efficiency in code generation processes.

Developers can leverage the `PluginMap` class to handle dependencies and configurations for different programming languages, databases, web frameworks, and cloud platforms. This centralization simplifies the adaptation and extension of `soap-cli` tools across different environments.

## Integration

To integrate `@soapjs/soap-cli-common` into your project, you can import the required classes and utilities directly into your `soap-cli` plugins or code generation scripts. This approach ensures that all soap-based tools maintain a coherent structure and adhere to the same standards for error handling, configuration, and plugin management.

For specific implementation details and examples, refer to the documentation provided within the package or the broader `soap` documentation.

## Contribution

Contributions to the `@soap-cli-common` package are welcome. Whether it's improving the existing code, adding new features, or fixing bugs, your input helps enhance the `soap` ecosystem. Please follow the contributing guidelines outlined in the repository.

## Documentation

For detailed documentation and additional usage examples, visit [SoapJS documentation](https://docs.soapjs.com).

## Issues
If you encounter any issues, please feel free to report them [here](https://github.com/soapjs/soap/issues/new/choose).

## Contact
For any questions, collaboration interests, or support needs, you can contact us through the following:

- Official:
  - Email: [contact@soapjs.com](mailto:contact@soapjs.com)
  - Website: https://soapjs.com
- Radoslaw Kamysz:
  - Email: [radoslaw.kamysz@gmail.com](mailto:radoslaw.kamysz@gmail.com)
  - Warpcast: [@k4mr4ad](https://warpcast.com/k4mr4ad)
  - Twitter: [@radoslawkamysz](https://x.com/radoslawkamysz)

## License

@soapjs/soap-cli-common is [MIT licensed](./LICENSE).
