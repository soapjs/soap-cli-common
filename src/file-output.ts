export class FileDescriptor {
  constructor(
    public readonly path: string,
    public readonly write_method: string,
    public readonly rank: number,
    public readonly content: string
  ) {}
}
