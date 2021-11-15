initSidebarItems({"derive":[["TS","Derives TS for a struct or enum. Please take a look at TS for documentation."]],"macro":[["export","Expands to a test function which exports typescript bindings to one or multiple files when running `cargo test`. If a type depends on an other type which is exported to a different file, an appropriate import will be included. If a file already exists, it will be overriden. Missing parent directories of the file(s) will be created. Paths are interpreted as being relative to the project root."],["export_here","Like `export!` but instead of creating a test function it executes the binding generation right here. This may be useful if you’d like to run the binding generation in any other context than a test."]],"trait":[["TS","A type which can be represented in TypeScript. Most of the time, you’d want to derive this trait instead of implementing it manually. ts-rs comes with implementations for all numeric types, `String`, `Vec`, `Option` and tuples."]]});