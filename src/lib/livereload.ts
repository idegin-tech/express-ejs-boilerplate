import path from 'path';

export async function createLiveReloadServer() {
    const { default: livereload } = await import('livereload');
    const rootDir = process.cwd();

    const liveReloadServer = livereload.createServer({
        exts: ['ejs', 'js', 'ts', 'css', 'html', 'json'],
        delay: 500,
    });

    liveReloadServer.watch([
        path.join(rootDir, 'src/site'),
        path.join(rootDir, 'dist'),
    ]);

    console.log('LiveReload server started');

    return liveReloadServer;
}
