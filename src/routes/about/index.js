import { h } from 'preact';
import { Link } from 'preact-router/match';

const About = () => {

  document.title = 'About - MyPrompter';

  return (
    <div class="container">
      <h1>MyPrompter</h1>
      <h2>An easy to use teleprompter.</h2>
      <p>
        MyPrompter is an easy to use teleprompter, build as an experiment
        and learning tool for me.
      </p>

      <p>
        It will automatically save your script locally on your device every
        few seconds. If you are signed in, it will automatically save your
        scripts to the cloud.
      </p>

      <p>
        There's a pre-loaded sample script you can try in the&nbsp;
        <Link href="/editor/sample">editor</Link> or in the&nbsp;
        <Link href="/prompter/sample">prompter</Link>.
      </p>

      <h2>Keyboard shortcuts</h2>
      <p>
        In Prompter view, you can use keyboard shortcuts to quickly do things,
        they're not configurable currently, but maybe in the future.
      </p>
      <table>
        <thead>
          <tr>
            <td class="fw-bold">Command</td>
            <td class="fw-bold">Key</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Play / Pause</td>
            <td><kbd>Space</kbd></td>
          </tr>
          <tr>
            <td>Scroll Speed (down/up)</td>
            <td><kbd>Left Arrow / Right Arrow</kbd></td>
          </tr>
          <tr>
            <td>Prev/Next Marker</td>
            <td><kbd>j / k</kbd></td>
          </tr>
          <tr>
            <td>Full Screen</td>
            <td><kbd>f</kbd></td>
          </tr>
          <tr>
            <td>Restart</td>
            <td><kbd>ESC</kbd></td>
          </tr>
          <tr>
            <td>Scroll within script</td>
            <td>
              <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>Page Down</kbd>,&nbsp;
              <kbd>Page Up</kbd>, <kbd>Arrow Down</kbd>, <kbd>Arrow Up</kbd>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-muted small mt-3">
        <div>
          <span class="fw-bold">Build Type:</span> <span>{__BUILD_TYPE__}</span>
        </div>
        <div>
          <span class="fw-bold">Build Date:</span> <span>{__BUILD_DATE__}</span>
        </div>
      </div>
    </div>
  );
};

export default About;
