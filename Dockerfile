FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash - && apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash - && apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*
COPY . /src/xxx/
WORKDIR "/src/xxx"
RUN dotnet restore "xxx.csproj"
RUN dotnet build "xxx.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "xxx.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "xxx.dll"]
