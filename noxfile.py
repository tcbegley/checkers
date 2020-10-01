import nox

SOURCES = ["backend", "lib", "tests", "noxfile.py"]


@nox.session()
def lint(session):
    """Lint Python source"""
    session.install("black", "flake8", "isort")
    session.run("black", "--check", *SOURCES)
    session.run("flake8", *SOURCES)
    session.run("isort", "--check", *SOURCES)


@nox.session()
def test(session):
    """Run tests"""
    session.install("poetry")
    env = {"VIRTUAL_ENV": session.virtualenv.location}
    session.chdir("backend")
    session.run("poetry", "install", "--no-dev", env=env, external=True)
    session.chdir("..")
    session.install("pytest")
    session.run("pytest")
